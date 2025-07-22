import { Button } from '@/components/ui/button'
import React from 'react'
import { UniverseButton } from "../components/UniverseButton";
import CompanionCard from '../components/CompanionCard';
import CompanionsList from '@/components/CompanionsList';
import Cta from '@/components/Cta';
import { recentSessions } from '@/constants';

const Page = () => {
  return (
    <main>
      

      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <section className = "home-section">
        <CompanionCard //this is passed as props to the CompanionCard component
          id="123"
          name = "Neura the brainy explorer"
          topic="Math"
          subject="science"
          duration={45}
          color = "#ffda6e"
          />

        <CompanionCard
          id="245"
          name = "number wizz"
          topic="derivatives"
          subject="math"
          duration={30}
          color = "#e5d0ff"
        />
        <CompanionCard
          id="789"
          name = "VOCAB BUILDER"
          topic="Language"
          subject="math"
          duration={30}
          color = "#BDE7FF"
        />
      </section>
      
     <section className = "home-section">
      <CompanionsList
        title="Recently Completed Sessions"
        companions = {recentSessions}
        classNames = "w-2/3 max-lg:w-full"//
      />
      <Cta/>
     </section>

    </main>
  )
}

export default Page