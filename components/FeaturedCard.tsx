import icons from '@/constants/icons'
import images from '@/constants/images'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Models } from 'react-native-appwrite'

export interface CardProperty extends Models.Document {
    name: string;
    address: string;
    image: string;
    rating: number;
    price: number;
}

function FeaturedCard({ item, onPress }: { item: CardProperty, onPress?: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} className="items-start relative w-60 h-80">
            <Image source={{ uri: item.image }} className="size-full rounded-2xl" />
            <Image source={images.cardGradient} className="size-full rounded-2xl absolute bottom-0" />

            <View className="flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
                <Image source={icons.star} className="size-3.5" />
                <Text className="text-xs font-rubik-bold text-primary-300 ml-1">{item.rating}</Text>
            </View>

            <View className="items-start absolute bottom-5 inset-x-5">
                <Text numberOfLines={1} className="text-xl font-rubik-extrabold text-white">{item.name}</Text>
                <Text className='text-base font-rubik text-white'>{item.address}</Text>

                <View className="flex-row items-center justify-between w-full">
                    <Text className="text-xl font-rubik-extrabold text-white">${item.price}</Text>
                    <Image source={icons.heart} className="size-5" />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default FeaturedCard