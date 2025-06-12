import React, { useState } from 'react'
import Title from '../../components/Title'

const Dashboard = () => {

    const [dashboardData, setDashboardData] = useState([])

  return (
    <div>
      <Title align='left' font='outfit' title='Dashboard' subTitle='Welcome to your dashboard' />

      <div className='flex gap-4 my-8'>
        <div className='bg-primary/3 border border-primary/10 rounded p-4 pr-8'>
            <img src="" alt="" className='max-sm:hidden h-10' />
            <div className='flex flex-col sm:ml-4 font-medium'>
                <p className='text-blue-500 text-lg'>Total Bookings</p>
                <p className='text-neutral-400 text-base'>{dashboardData}</p>
            </div>
        </div>
        <div className='bg-primary/3 border border-primary/10 rounded p-4 pr-8'>
            <img src="" alt="" className='max-sm:hidden h-10' />
            <div className='flex flex-col sm:ml-4 font-medium'>
                <p className='text-blue-500 text-lg'>Total Revenue</p>
                <p className='text-neutral-400 text-base'> $ {dashboardData}</p>
            </div>
        </div>
      </div>

      <h2 className='text-xl text-blue-950/70 font-mediun mb-5'>Recent Bookings</h2>
        <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>

            <table className='w-full'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                        <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
                    </tr>
                </thead>

                <tbody className='text-sm'>
                    {dashboardData.map((item, index) => (
                        <tr key={index}>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.user}</td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>{item.room}</td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>$ {item.totalAmount}</td>
                            <td className='py-3 px-4 border-t border-gray-300 flex'>
                                <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-green-200 text-green-600' : 'bgamber-200 text-yellow-600'}`}>
                                    {item.isPaid ? 'Complete' : 'Pending'}
                                </button>
                            </td>
                        </tr>
                    ))

                    }
                </tbody>

            </table>
        </div>
    </div>
  )
}

export default Dashboard
