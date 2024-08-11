import { FaArrowRight } from 'react-icons/fa'
import Instructor from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import CTAButton from '../HomePage/Button'
function InstructorSection() {
    return (
        <div className='mt-14'>


            <div className="flex flex-row  gap-20 items-center ">
                <div className="w-[50%] ">
                    <img src={Instructor} alt="Instructor"
                        className='shadow-white'
                    />
                </div>
                <div className='w-[50%] flex flex-col gap-10'>
                    <div className='text-4xl font-semibold w-[50%]'>
                        Become an
                        <HighlightText text={"Instructor"} />
                    </div>
                    <p
                        className='font-medium text-[16px]  text-richblack-300 w-[80%]'>Instructors from around the world teach millions of students on CodePlay. We provide the tools and skills to teach what you love.

                    </p>
                    <div className='w-fit'>
                        <CTAButton active={true} linkto={'/signup'}>
                            <div className='flex flex-row gap-2 items-center'>
                                Start Learning Tody
                                <FaArrowRight />
                            </div>
                        </CTAButton>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default InstructorSection