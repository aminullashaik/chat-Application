import ChannelSidebar from "@/components/ChannelSidebar"
import WorkspaceSidebar from "@/components/MiniSidebar"

const Home = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
            <WorkspaceSidebar />
            <ChannelSidebar />
        </div>
    )
}

export default Home