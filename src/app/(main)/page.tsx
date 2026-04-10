import {
    AdBannerSection,
    HomeTutorialGate,
    WeeklyDiningScheduleSection,
    WeeklyPopularRestaurantsSection,
} from "@/src/components/home";
import { BottomNavigationBar, Header } from "@/src/components/layout";
import {
    mockWeeklyDinings,
} from "@/src/constants/mock-data";

export default function HomePage() {
    return (
        <>
            <HomeTutorialGate />
            <Header showBackButton={false} showMoreButton={true} showAlarmButton={true} />
            <main className="flex min-h-screen flex-col items-center gap-6 px-4 pb-24">
                <AdBannerSection/>
                <WeeklyDiningScheduleSection dinings={mockWeeklyDinings} />
                <WeeklyPopularRestaurantsSection /> 
            </main>
            <BottomNavigationBar />
        </>
    );
}
