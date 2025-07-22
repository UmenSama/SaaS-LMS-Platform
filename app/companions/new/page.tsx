import CompanionForm from "@/components/CompanionForm"

const NewCompanion = () => {
  return (
    <main className ="min-lg:w-1/3 min-md:w-2/3 items-center justify-content">
        <article className="w-full gap-4 flex flex-col">
          <h1>Build a New Companion</h1>
          
          <CompanionForm />
        </article>
    </main>
  )
}

export default NewCompanion
