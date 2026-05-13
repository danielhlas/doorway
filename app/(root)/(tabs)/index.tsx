import Card from "@/components/Card";
import FeaturedCard from "@/components/FeaturedCard";
import Filter from "@/components/Filter";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/contextProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { data: user } = useGlobalContext() //data about user

  const params = useLocalSearchParams<{ filter?: string, query?: string }>()

  const { data: latestProperties, loading: latestLoading } = useAppwrite({ fn: getLatestProperties })

  const { data: properties, loading: propertiesLoading, refetch } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true //we can skip num of elements if needed
  })

  function handleCardPress(id: string) {
    router.push(`/properties/${id}`)
  }

  //if filter/query changes, we need to refetch
  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6
    });
  }, [params.filter, params.query])

  return (
    <SafeAreaView className="bg-white h-full">

      {/*Recommended cards */}
      <FlatList
        data={properties}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <Card item={item} onPress={() => handleCardPress(item.$id)} />}
        numColumns={2}
        columnWrapperClassName={"gap-3 px-5"}
        showsVerticalScrollIndicator={false}
        className={"mt-5"}
        contentContainerClassName={"pb-24"}
        ListEmptyComponent={
          propertiesLoading ?
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
            : <NoResults />}
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-sx font-rubik text-black-100">Good Morning</Text>
                  <Text className="text-base font-rubik-medium text-black-300">{user?.name.split(" ")[0]}</Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>


            {/*Featured row */}
            <View className="flex-row items-center justify-between mt-5">
              <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">See all</Text>
              </TouchableOpacity>
            </View>

            {/*Featured cards */}
            {latestLoading ?
              <ActivityIndicator size="large"
                className="text-primary-300" /> : !latestProperties ||
                  latestProperties.length === 0 ? <NoResults /> : (
                <FlatList
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  className="flex-row gap-5 mt-5"
                  contentContainerClassName={"flex-row gap-3"}
                  data={latestProperties}
                  keyExtractor={(item) => item.$id}
                  renderItem={({ item }) => <FeaturedCard item={item} onPress={() => handleCardPress(item.$id)} />}
                />
              )}


            {/*Recommendation row */}
            <View className="flex-row items-center justify-between mt-5">
              <Text className="text-xl font-rubik-bold text-black-300">Recommendation</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">See all</Text>
              </TouchableOpacity>
            </View>

            <Filter />
            <Search />
          </View>
        }
      />



    </SafeAreaView>
  );
}
