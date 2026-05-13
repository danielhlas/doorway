import icons from "@/constants/icons"
import images from "@/constants/images"
import { login } from "@/lib/appwrite"
import { useGlobalContext } from "@/lib/contextProvider"
import { Redirect } from "expo-router"
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function SignIn() {
    const insets = useSafeAreaInsets()

    const { refetch, loading, logged } = useGlobalContext();

    //redirect to homepage
    if (!loading && logged) return <Redirect href="/" />

    async function handleSignIn() {
        const result = await login();

        if (result) {
            //tady obvykle dáváme redirect, ale my máme redirect již uvnitř refetch:
            refetch()
        } else {
            Alert.alert("Error", "Failed to login")
        }
    }

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                backgroundColor: "#F6FBFC"
            }}
        >
            <ScrollView contentContainerClassName="h-full">
                <Image source={images.onboarding} className="w-full h-[63%] mt-5" resizeMode="contain" />
                <View className="px-10">
                    <Text className="text-base text-center uppercase font-rubik text-black-200">Welcome to Doorway</Text>
                    <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">Lets get your closer to </Text>
                    <Text className="text-3xl font-rubik-bold text-primary-300 text-center mt-2"> your new home </Text>

                    <TouchableOpacity onPress={handleSignIn} className="bg-white shadow-md shadow-winc-300 rounded-full w-full py-4 mt-10 flex-row items-center justify-center gap-2">
                        <Image source={icons.google} className="w-5 h-5" resizeMode="contain" />
                        <Text className="font-rubik text-black-200">Login with Google</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </ View>

    )
}