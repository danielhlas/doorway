import { facilities } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getPropertyById } from "@/lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Property() {

  const params = useLocalSearchParams<{ id?: string }>()

  const { data, loading } = useAppwrite({
    fn: getPropertyById,
    params: {
      id: params.id!,
    }
  })

  return (
    <ScrollView showsVerticalScrollIndicator={false}>

      <TouchableOpacity onPress={router.back} className='absolute top-12 left-3 bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full z-50'>
        <Image source={icons.backArrow} className="size-8 z-50" tintColor="#000" />
      </TouchableOpacity>
      <Image source={{ uri: data?.image }} className='w-full h-96' />

      <View className="pb-10 px-7 mt-4">
        <View className="items-start mt-2">
          {/*first row */}
          <Text className="text-3xl font-rubik-extrabold text-black-300">
            {data?.name}
          </Text>

          {/*second row */}
          <View className="flex-row gap-1 mt-2.5">
            <Text className="text-sm bg-violet-100 text-violet-900 rounded-full uppercase px-2.5 py-0.5">
              {data?.type}
            </Text>

            <View className="flex-row items-center ml-3">
              <Image source={icons.star} className="size-3.5" />
              <Text className="text-black-200 ml-1">{data?.rating?.toFixed(1)}
                {data?.reviews?.length > 0 && (
                  <Text className="text-black-200 ml-1"> ({data?.reviews?.length} reviews)</Text>
                )}
              </Text>

            </View>
          </View>

          {/*third row*/}
          <View className="flex-row items-center w-full justify-between mt-2.5">

            <View className="flex-row items-center">
              <View className="bg-violet-100 rounded-full p-2.5">
                <Image source={icons.bed} className="size-8" tintColor="#8B5DFF" />
              </View>
              <Text className=" font-semibold ml-1">{data?.bedrooms} Beds</Text>
            </View>

            <View className="flex-row items-center">
              <View className="bg-violet-100 rounded-full p-2.5">
                <Image source={icons.bath} className="size-8" tintColor="#8B5DFF" />
              </View>
              <Text className=" font-semibold ml-1">{data?.bathrooms} Baths</Text>
            </View>

            <View className="flex-row items-center">
              <View className="bg-violet-100 rounded-full p-2.5">
                <Image source={icons.area} className="size-8" tintColor="#8B5DFF" />
              </View>
              <Text className=" font-semibold ml-1"> {data?.area} sqft</Text>
            </View>
          </View>
        </View>

        {/*Agent section */}
        <View className="border-t border-primary-200 pt-5 mt-5">
          <Text className="text-xl font-bold">Agent</Text>

          <View className="flex-row items-center mt-3 justify-between">
            <View className="flex-row items-center">
              <Image source={{ uri: data?.agent?.avatar }} className="size-14 rounded-full" />
              <View className="ms-3 items-start">
                <Text className="text-lg font-bold">{data?.agent?.name}</Text>
                <Text className="font-semibold text-black-200">{data?.agent?.email}</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity><Image source={icons.chat} className="size-9" /></TouchableOpacity>
              <TouchableOpacity><Image source={icons.phone} className="size-9" /></TouchableOpacity>
            </View>
          </View>
        </View>

        {/*Overview section*/}
        <View className="border-t border-primary-200 pt-5 mt-5">
          <Text className="text-xl font-bold">Overview</Text>
          <Text className="text-black-200 font-rubik mt-2">
            {data?.description}
          </Text>
        </View>

        {/*Facilities*/}

        <Text className="text-xl font-bold mt-8">Facilities</Text>

        {data?.facilities.length > 0 && (
          <View className="flex-row gap-5 items-start justify-start mt-2">
            {data?.facilities.map((item: string, index: number) => {
              const facility = facilities.find(
                (facility) => facility.title === item
              );

              return (
                <View key={index} className="flex-1 flex-col items-center min-w-16 max-w-20">
                  <View className="size-14 bg-primary-100 rounded-full items-center justify-center">
                    <Image source={facility ? facility.icon : icons.info} className="size-6" tintColor="#8B5DFF" />
                  </View>

                  <Text numberOfLines={1} className="text-black-300 text-sm text-center font-rubik mt-1.5">
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        )}


        {/*Location*/}
        <Text className="font-bold text-xl mt-8">Location</Text>
        <View className="flex-row gap-5 mt-3">
          <Image source={icons.location} className="size-5" tintColor="#8B5DFF" />
          <Text className="text-black-300 font-rubik">{data?.address}</Text>
        </View>
        <Image
          source={images.map}
          className="h-52 w-full mt-5 rounded-xl"
        />


        {/*Reviews*/}
        <View className="flex-row justify-between mt-5">
          <View className="flex-row items-center gap-2">
            <Image source={icons.star} className="size-5" />
            <Text className="text-xl font-bold">{data?.rating.toFixed(1)}
              {data?.reviews.length > 0 && (
                <Text> ({data?.reviews.length} reviews)</Text>
              )}
            </Text>
          </View>
          <TouchableOpacity>
            <Text className="text-violet-700 font-bold">See reviews</Text>
          </TouchableOpacity>
        </View>
        {/*single review*/}
        {data?.reviews.length > 0 && (
          <View className="mt-5">
            <View className="flex-row items-center gap-3">
              <Image source={{ uri: data?.reviews[0].avatar }} className="size-12 rounded-full" />
              <Text className="font-bold text-xl font-rubik">{data?.reviews[0].name}</Text>
            </View>
            <Text className="text-black-200 font-rubik mt-3 leading-relaxed">{data?.reviews[0].review}</Text>

            <View className="flex-row justify-between items-center mt-1">
              <View className="flex-row gap-1.5 items-center">
                <TouchableOpacity>
                  <Image source={icons.heart} className="size-7" tintColor="#8B5DFF" />
                </TouchableOpacity>
                <Text>{data?.reviews[0].$sequence}</Text>
              </View>
              <Text className="text-black-200">{data?.reviews[0].$createdAt.split("T")[0].split("-").reverse().join(".")}</Text>
            </View>
          </View>
        )}



        {/*Price + btn*/}
        <View className="flex-row items-center w-full justify-between mt-8">
          <View>
            <Text className="text-md uppercase">Price</Text>
            <Text className="text-2xl font-rubik-bold text-violet-600">${data?.price}</Text>
          </View>

          <TouchableOpacity className="bg-violet-600 rounded-full px-10 py-3">
            <Text className="text-white text-lg font-rubik-bold shadow-lg">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View >
    </ScrollView>
  );
}
