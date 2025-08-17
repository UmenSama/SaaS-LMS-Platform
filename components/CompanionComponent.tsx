'use client'
import { cn, configureAssistant, getSubjectColor } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import soundwaves from '@/constants/soundwaves.json'
import { addToSessionHistory } from '@/lib/actions/companion.actions'

enum CallStatus{
    INACTIVE ='INACTIVE',
    CONNECTING ='CONNECTING',
    ACTIVE='ACTIVE',
    FINISHED='FINISHED'
}

const CompanionComponent = ({companionId, subject, topic, name, userName, 
    userImage, style, voice, duration}: CompanionComponentProps) => {

        const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE) //callStatus must always be one of the values from the CallStatus enum.
        const [isSpeaking, setIsSpeaking] = useState(false)
        const [messages,setMessages] = useState<SavedMessage[]>([])

    const [isMuted,setIsMuted] = useState(false);
    const lottieRef = useRef<LottieRefCurrentProps>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

        useEffect(()=>{
            if(lottieRef){
                if(isSpeaking){
                    lottieRef.current?.play()
                } else{
                    lottieRef.current?.stop()
                }
            }
        },[isSpeaking,lottieRef])

        useEffect(()=>{
            const onCallStart = ()=> {
                setCallStatus(CallStatus.ACTIVE);
                // Start timer for duration (in minutes)
                if (duration && typeof duration === 'number' && duration > 0) {
                    timerRef.current = setTimeout(() => {
                        setCallStatus(CallStatus.FINISHED);
                        vapi.stop();
                    }, duration * 60 * 1000); // duration in ms
                }
            }

            const onCallEnd = ()=> {
                setCallStatus(CallStatus.FINISHED);
                addToSessionHistory(companionId);
                // Clear timer if call ends early
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
            }

            const onMessage = (message: Message)=> {
                if(message.type==='transcript' && message.transcriptType==='final'){ //Real-time Processing
                    // VAPI sends message events with transcript data
                    // message.type === 'transcript' - identifies transcript messages
                    // message.transcriptType === 'final' - only final (not interim) transcripts
                     const newMessage={role: message.role, content:message.transcript} //role is either user,system, or assistant
                    setMessages((prev)=> [newMessage,...prev])
                }
            }

            const onSpeechStart =()=> setIsSpeaking(true)
            const onSpeechEnd =()=> setIsSpeaking(false)

            const onError= (error: Error) => console.log('Error', error)

            vapi.on('call-start', onCallStart);
            vapi.on('call-end', onCallEnd)
            vapi.on('message', onMessage)
            vapi.on('error',onError)
            vapi.on('speech-start',onSpeechStart)
            vapi.on('speech-end',onSpeechEnd)
            
            return()=>{
                vapi.off('call-start', onCallStart);
                vapi.off('call-end', onCallEnd)
                vapi.off('message', onMessage)
                vapi.off('error',onError)
                vapi.off('speech-start',onSpeechStart)
                vapi.off('speech-end',onSpeechEnd)
                // Clear timer on unmount
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
            }
        },[])
        
        const toggleMicrophone = ()=>{
            const isMuted = vapi.isMuted();
            vapi.setMuted(!isMuted); 
            setIsMuted(!isMuted)
        }

        const handleCall = async () =>{
            setCallStatus(CallStatus.CONNECTING)

            const assistantOverrides = {
                variableValues: {subject,topic,style},
                clientMessages: ['transcript'],
                serverMessages: []
            }
            //@ts-expect-error
            vapi.start(configureAssistant(voice,style),assistantOverrides)
        }

        const handleDisconnect=()=>{
            setCallStatus(CallStatus.FINISHED)
            vapi.stop()
            // Clear timer if manually disconnected
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }

        return (
            <section className="flex flex-col min-h-[70vh]">
        <section className = "flex gap-8 max-sm:flex-col mb-8"> 
            <div className="companion-section">
                <div className="companion-avatar" style={{backgroundColor: getSubjectColor(subject)}}>
                    <div className={
                        cn(
                            'absolute transition-opacity duration-1000', 
                            callStatus===CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0',
                            callStatus===CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                            
                            )
                    }>
                        <Image src = {`/icons/${subject}.svg`} alt={subject} width={150} height ={150} className="max-sm:w-fit"/>
                    </div>

                    <div className={
                        cn(
                            'absolute transition-opacity duration-1000',
                            callStatus===CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
                        )
                    }>
                        <Lottie
                          lottieRef={lottieRef}
                            animationData={soundwaves}
                            autoplay={false}
                            className='companion-lottie'

                          />

                    </div>
                </div>
                <p className = 'font-bold text-2xl'>{name}</p>
            </div>
            <div className="user-section">
                <div className="user-avatar">
                    <Image src={userImage} alt={userName} width ={130} height={130} className='rounded-lg'/>
                <p className='font-bold text-2xl'>
                    {userName}
                </p>
                </div>
                    <button className="btn-mic" onClick={toggleMicrophone} disabled={callStatus!== CallStatus.ACTIVE}>
                        <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt='mic' width={36} height={36} />
                        <p className="max-sm:hidden">
                            {isMuted? 'Turn on microphone': 'Turn off microphone'}
                        </p>
                    </button>
                    <button className={
                        cn(
                            'rounded-lg py-2 cursor-pointer transition-colors w-full text-white'
                            , callStatus===CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary'
                            , callStatus===CallStatus.CONNECTING && 'animate-pulse'
                    )} 
                    onClick={callStatus===CallStatus.ACTIVE ? handleDisconnect : handleCall} 
                    >
                        {callStatus===CallStatus.ACTIVE ? 'End Session' :
                            callStatus===CallStatus.CONNECTING ? 'Connecting...' :
                                'Start Session'  }

                    </button>
            </div>
        </section>
        <section className='transcript'>
            <div className='transcript-message no-scrollbar'>
                {messages.map((message,index)=>{
                    if(message.role==='assistant'){
                        return(
                            <p key={index} className="max-sm:text:sm">
                                {name
                                    .split(' ')[0]
                                    .replace(/[.,]/g,'')
                                }: {message.content}
                            </p>
                        )
                    }else{
                        return <p key={index} className="text-primary max-sm:text-sm">
                            {userName} : {message.content}
                        </p>
                    }
                })}
            </div>
                <div className="transcript-fade" />
        </section>
    </section>
  )
}

export default CompanionComponent
