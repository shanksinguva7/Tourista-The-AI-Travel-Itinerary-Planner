
import Header from './Header'
import StatsCard from '../../../components/StatsCard'
import TripCard from '../../../components/TripCard'
const dashboard = () => {
  const user = {name: "Shashank"}
  const dashboardStats = {
    totalUsers:12450,
    usersJoined: { currentMonth:218, lastMonth: 176},
    totalTrips: 3210,
    tripsCreated: {currentMonth: 150, lastMonth: 250},
    userRole: {total:62, currentMonth: 25, lastMonth: 15}
  }

  const {totalUsers, usersJoined, totalTrips, tripsCreated, userRole} = dashboardStats
  return (
    <main className = "dashboard warapper">
      <Header
        title = {`Hello ${user.name}`}
        description = {`Let the AI do the planning for you!`}
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gpa-6 w-full">
          
          <StatsCard 
            headerTitle = "Total Trips"
            total = {totalTrips}
            currentMonthCount = {tripsCreated.currentMonth}
            lastMonthCount = {tripsCreated.lastMonth}
          />

          <StatsCard
              headerTitle = "Active Users"
              total = {totalUsers}
              currentMonthCount = {usersJoined.currentMonth}
              lastMonthCount = {usersJoined.lastMonth}
          
          />

          <StatsCard
              headerTitle = "Total Users"
              total = {userRole.total}
              currentMonthCount = {userRole.currentMonth}
              lastMonthCount = {userRole.lastMonth}
          
          />
        </div>
      </section>

      
      <TripCard/>
    </main>
  )
}

export default dashboard