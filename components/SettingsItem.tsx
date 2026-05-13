import icons from "@/constants/icons";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

type SettingsItemProps = {
    icon: ImageSourcePropType,
    title: string,
    onPress?: () => void,
    textStyle?: string,
    showArrow?: boolean
}

export default function SettingsItem({ icon, title, onPress, textStyle, showArrow = true }: SettingsItemProps) {
    return (
        <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
                <Image source={icon} className="size-7" />
                <Text className={`text-lg font-rubikmedium text-black-300 ${textStyle}`}>{title}</Text>
            </View>
            {showArrow && <Image source={icons.rightArrow} className="size-5" />}
        </TouchableOpacity>
    )
}