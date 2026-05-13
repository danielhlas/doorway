import Card from "@/components/Card";
import Filter from "@/components/Filter";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getProperties } from "@/lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Explore() {

    const params = useLocalSearchParams<{ filter?: string, query?: string }>()


    const { data: properties, loading: propertiesLoading, refetch } = useAppwrite({
        fn: getProperties,
        params: {
            filter: params.filter!,
            query: params.query!,
            limit: 20,
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
                ListEmptyComponent={
                    propertiesLoading ?
                        <ActivityIndicator size="large" className="text-primary-300 mt-5" />
                        : <NoResults />}
                ListHeaderComponent={
                    <View className="px-5">
                        <View className="mb-3">
                            <View className="flex-row items-center justify-between mt-5">
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    className="flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
                                >
                                    <Image
                                        source={icons.backArrow}
                                        className="size-5"
                                    />
                                </TouchableOpacity>

                                <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                                    Search for Your Ideal Home
                                </Text>

                                <Image source={icons.bell} className="w-6 h-6" />
                            </View>
                        </View>

                        <Search />

                        <View className="mt-5">
                            <Filter />
                            <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                                Found {properties?.length} properties
                            </Text>
                        </View>
                    </View>
                }
            />



        </SafeAreaView>
    );
}
