import { useGlobalContext } from "@/lib/contextProvider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
	const { loading, logged } = useGlobalContext();

	if (loading) {
		return (
			<SafeAreaView>
				<ActivityIndicator className="text-primary-300" size="large" />
			</SafeAreaView>
		)
	}

	//not logged
	if (!logged) return <Redirect href="/signIn" />

	//is logged
	return <Slot />
}