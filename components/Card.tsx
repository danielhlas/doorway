import icons from '@/constants/icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Models } from 'react-native-appwrite';

export interface CardProperty extends Models.Document {
    name: string;
    address: string;
    image: string;
    rating: number;
    price: number;
}

function Card({ item, onPress }: { item: CardProperty, onPress?: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} className='relative flex-1 w-full mt-4 py-4 rounded-lg bg-white shadow-lg sadow-black-100/70 '>

            <View className="absolute flex-row items-center px-2 py-0.5 top-7 right-3 bg-white/90 rounded-full z-50">
                <Image source={icons.star} className="size-3.5" />
                <Text className="text-xs font-rubik-bold text-primary-300 ml-1 pt-0.5">{item.rating}</Text>
            </View>

            <Image source={{ uri: item.image }} className='w-full h-40 rounded-lg' />

            <View className="mt-2 px-2">
                <Text className="text-base font-rubik-bold text-black-100">{item.name}</Text>
                <Text className='text-xs font-rubik text-black-200'>{item.address}</Text>

                <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-base font-rubik-bold text-primary-300">${item.price}</Text>
                    <Image source={icons.heart} className="w-5 h-5 mr-2" tintColor="#191d31" />
                </View>
            </View>

        </TouchableOpacity>
    )
}

export default Card