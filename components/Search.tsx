import icons from '@/constants/icons';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

export default function Search() {
	const path = usePathname();
	const params = useLocalSearchParams<{ query?: string }>();
	const [search, setSearch] = useState(params.query);

	const debouncedSearch = useDebouncedCallback((text: string) => router.setParams({ query: text }), 500);

	function handleSearch(text: string) {
		setSearch(text)
		debouncedSearch(text)
	}

	return (
		<View className="flex-row items-center justify-between w-full rounded-lg bg-accent-100 border border-primary-100 px-4 mt-1">
			<View className="flex-1 flex-row items-center justify-start z-50">
				<Image source={icons.search} className="size-5" />
				<TextInput
					value={search}
					onChangeText={handleSearch}
					placeholder='Search for anything'
					className="flex-1 text-sm font-rubik text-black-300 ml-2 mt-1"
				/>
			</View>
			<TouchableOpacity>
				<Image source={icons.filter} className="size-5" />
			</TouchableOpacity>
		</View>
	)
}