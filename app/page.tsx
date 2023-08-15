"use client"
import { useState } from "react"
import { Configuration, OpenAIApi } from "openai"
import toast, { Toaster } from "react-hot-toast"
export default function Home() {
  // open ai api
  const openAi = new OpenAIApi(
    new Configuration({
      apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
    })
  )
  const [messageType, setMessageType] = useState("")
  const [ResponseType, SetResponseType] = useState("")
  const [email, setEmail] = useState("")
  const [err, setErr] = useState("")
  const [response, setRes] = useState("")

  const [Loading, setLoading] = useState(false)

  const SetMessageType = (e: any) => {
    setMessageType(e.target.value)
  }
  const setResponseType = (e: any) => {
    SetResponseType(e.target.value)
  }
  const handleClick = () => {
    if (!email || !messageType || !ResponseType) {
      toast.error("Please enter a topic")

      console.log(err)
      return null
    }

    setLoading(true)
    openAi
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `write a ${messageType} responding to following  ${ResponseType} : ${email}`,
          },
        ],
      })
      .then((res) => {
        setRes(res.data.choices[0].message?.content as string)
        setEmail(res.data.choices[0].message?.content as string)

        setLoading(false)
      })
  }
  return (
    <div className='flex justify-center items-center h-screen bg-neutral-200'>
      <div className='flex flex-col w-[500px] h-[700px] bg-white m-auto p-[30px] rounded-lg shadow-lg'>
        <h1 className='text-center text-2xl mb-[15px] text-teal-500 font-semibold'>
          Email-GPT
        </h1>
        <div className='w-full h-[1px] bg-neutral-300 mb-[15px]' />
        <select
          disabled={Loading}
          onChange={(e) => SetMessageType(e)}
          defaultValue={"messageType"}
          className='text-black bg-neutral-100 px-[35px] py-[10px] m-[10px] rounded-md shadow-lg disabled:cursor-not-allowed'
        >
          <option value='messageType' disabled>
            Message Type
          </option>

          <option value='Email'>Email</option>
          <option value='Message'>Message</option>
        </select>

        <select
          disabled={Loading}
          onChange={(e) => setResponseType(e)}
          defaultValue={"ResponseType"}
          className='text-black bg-neutral-100 px-[35px] py-[10px] m-[10px] rounded-md shadow-lg disabled:cursor-not-allowed'
        >
          <option value='ResponseType' disabled>
            Response Type
          </option>

          <option value='Formal'>Formal</option>
          <option value='Informal'>Informal</option>
        </select>
        <textarea
          value={email}
          className='bg-neutral-100 mt-[20px] p-[10px] rounded-md disabled:cursor-not-allowed'
          rows={15}
          placeholder={Loading ? "🕒 Loading..." : "Email"}
          disabled={Loading}
          onChange={(e) => {
            setEmail(e.target.value)
            if (e.target.value === "") {
              setRes("")
            }
          }}
        ></textarea>
        <div className='flex gap-[20px]'>
          <button
            disabled={Loading}
            onClick={handleClick}
            className='bg-teal-500 hover:bg-teal-600 py-[9px] px-[20px] mt-[10px] rounded-md shadow-md disabled:cursor-not-allowed w-full'
          >
            {Loading ? "🕒 Loading..." : err ? err : "Generate 🚀"}
          </button>
          <button
            onClick={() => {
              toast.success("copied")

              navigator.clipboard.writeText(email)
            }}
            className={`bg-indigo-600 hover:bg-indigo-700 py-[9px] px-[20px] mt-[10px] rounded-md shadow-md disabled:cursor-not-allowed w-full text-white ${
              !response && "hidden"
            }`}
          >
            Copy 📋
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
