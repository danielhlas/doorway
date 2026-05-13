import SettingsItem from '@/components/SettingsItem'
import { settings } from '@/constants/data'
import icons from '@/constants/icons'
import { logout } from '@/lib/appwrite'
import { useGlobalContext } from '@/lib/contextProvider'
import React from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
    const { data, refetch } = useGlobalContext()

    async function handleLogout() {
        const result = await logout();

        if (result) {
            Alert.alert("You have been successfully logged out")
            refetch(); //refetch obsahuje i revalidating current logged user a renavigating him to singin page
        }
        else {
            Alert.alert("Something went wrong", "Try again")
        }
    }

    return (
        <SafeAreaView className='h-full bg-white'>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='pb-32 px-7'>
                <View className='flex-row items-center justify-between mt-5'>
                    <Text className="text-xl font-rubik-bold">
                        Profile
                    </Text>
                    <Image source={icons.bell} className='size-5' />
                </View>

                <View className='flex-row justify-center mt-5'>
                    <View className='items-center relative mt-5'>
                        <Image source={{ uri: data?.avatar }} className="size-44 relative rounded-full" />
                        <TouchableOpacity className='absoluete bottom-11 right-2'>
                            <Image source={icons.edit} className="size-9" />
                        </TouchableOpacity>
                        <Text className='text-2xl font-rubik-bold mt-2'> {data?.name} </Text>
                    </View>
                </View>

                <View className='mt-10'>
                    <SettingsItem icon={icons.calendar} title='My bookigs' />
                    <SettingsItem icon={icons.wallet} title='Payments' />
                </View>

                <View className='border-t border-primary-200 pt-5 mt-5'>
                    {settings.slice(2).map((item, index) => (<SettingsItem key={index} {...item} />))}
                </View>

                <View className='border-t border-primary-200 pt-5 mt-5'>
                    <SettingsItem icon={icons.logout} title='Logout' onPress={handleLogout} showArrow={false} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

