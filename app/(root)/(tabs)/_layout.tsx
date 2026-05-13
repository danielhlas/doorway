import icons from '@/constants/icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any; title: string }) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
        <Image
            source={icon}
            tintColor={focused ? '#0061ff' : '#666876'}
            resizeMode="contain"
            className="size-6"
        />
        <Text
            className={`${focused ? 'text-primary-300 font-rubik-medium' : 'text-black-200 font-rubik'
                } text-xs w-full text-center mt-1`}
        >
            {title}
        </Text>
    </View>
);

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: 'white',
                    position: 'absolute',
                    borderTopColor: '#0061FF1A',
                    borderTopWidth: 1,
                    minHeight: 70,
                }
            }}
        >
            <Tabs.Screen name="index" options={{
                title: "index",
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon icon={icons.home} title="Home" focused={focused} />
            }} />
            <Tabs.Screen name="explore" options={{
                title: "explore",
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon icon={icons.search} title="Explore" focused={focused} />
            }} />
            <Tabs.Screen name="profile" options={{
                title: "profile",
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon icon={icons.person} title="Profile" focused={focused} />
            }} />
        </Tabs>)
}
