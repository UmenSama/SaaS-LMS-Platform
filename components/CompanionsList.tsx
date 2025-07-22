import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { cn, getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CompanionsListProps {
  title: string;
  companions?: Companion[]; // ? means optional
  classNames?: string;
}

const CompanionsList = ({title, companions, classNames}: CompanionsListProps) => {
  return (
    <article className={cn('companion-list',classNames)}>
      <h2 className="text-3xl font-bold"> Recent Sessions</h2>
      <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="text-lg w-2/3">Lessons</TableHead>
      <TableHead className ="text-lg">Subject</TableHead>
      <TableHead className="text-lg text-right">Duration</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {companions?.map(({id,subject,name,topic, duration})=>(
        <TableRow key={id}>
            {/* Lessons column */}
            <TableCell>
                <Link href={`/companions/${id}`}>
                    <div className="flex items-center gap-2">
                        <div className = "size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                            <Image 
                                    src={`/icons/${subject}.svg`} 
                                    alt={subject} 
                                    width={35} 
                                    height={35}/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="font-bold text-2xl">
                                {name}
                            </p>
                            <p className="text-lg">
                                {topic}
                            </p>
                        </div>
                    </div>
                </Link>
            </TableCell>

            {/* Subject column - now with icon and name */}
            <TableCell>
                {/* Mobile: icon only */}
                <div className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                    <Image 
                        src={`/icons/${subject}.svg`} 
                        alt={subject} 
                        width={18} 
                        height={18}
                    />
                </div>
                {/* Desktop: icon + subject text */}
                <div className="hidden md:flex items-center gap-2 style={{backgroundColor: getSubjectColor(subject)}}">
                    <Image 
                        src={`/icons/${subject}.svg`} 
                        alt={subject} 
                        width={24} 
                        height={24}
                        className="rounded"
                    />
                    <span className="font-medium">{subject}</span>
                </div>
            </TableCell>

            <TableCell>{/* Duration column - styled and right-aligned */}
                <div className = "flex items-center gap-2 w-full justify-end">
                    <p className="text-2xl">
                        {duration} {' '}
                        <span className="max-md:hidden">mins</span>
                    </p>
                    <Image src="/icons/clock.svg" alt="minutes" width={14} height={14} className="md:hidden"/>
                </div>
            </TableCell>
        </TableRow>
    ))}
    
  </TableBody>
</Table>
    </article>
  )
}

export default CompanionsList


/* Common Tailwind CSS Classes in Your Code

1. flex
Description: Applies display: flex; to the element, enabling flexbox layout for its children.
2. items-center
Description: Aligns items vertically to the center within a flex container (align-items: center;).
3. gap-2
Description: Adds a gap (spacing) of 0.5rem (8px) between flex/grid children.
4. justify-center
Description: Horizontally centers children in a flex container (justify-content: center;).
5. rounded-lg
Description: Applies large border-radius for rounded corners.
6. w-fit
Description: Sets the width of the element to fit its content (width: fit-content;).
7. p-2
Description: Adds padding of 0.5rem (8px) on all sides.
8. md:hidden
Description: Hides the element on medium screens and up (display: none; for min-width: 768px).
9. max-md:hidden
Description: Hides the element on screens up to medium size (display: none; for max-width: 767px).
10. w-full
Description: Sets the width to 100% of the parent.
11. justify-end
Description: Aligns children to the end (right) in a flex container (justify-content: flex-end;).
12. text-2xl
Description: Sets the font size to extra-large (usually 1.5rem or 24px).
*/

