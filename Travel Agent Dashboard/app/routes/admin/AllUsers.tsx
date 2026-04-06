import React from 'react'
import Header from "~/routes/admin/Header";

const AllUsers = () => {
  return (
      <main className = "dashboard warapper">
        <Header
            title = {`Trips Page`}
            description = {`Check where other people are right now`}
        />

        All Users Page Contents
      </main>
  )
}

export default AllUsers