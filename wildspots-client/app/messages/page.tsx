import Layout from '@/src/components/Layout';

export default function MessagesPage() {
  const conversations = [
    { id: 1, name: 'Sarah Johnson', lastMessage: 'Hey, is the campsite still available this weekend?', time: '2h ago', unread: true },
    { id: 2, name: 'Mike Wilson', lastMessage: 'Thanks for the info!', time: '1d ago', unread: false },
    { id: 3, name: 'WildSpots Support', lastMessage: 'Your listing has been approved!', time: '3d ago', unread: false },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                      {conversation.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className={`text-sm font-medium ${conversation.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                          {conversation.name}
                        </p>
                        <p className="text-xs text-gray-500">{conversation.time}</p>
                      </div>
                      <p className={`text-sm ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-500'} truncate`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && (
                      <div className="ml-4">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block"></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-4 sm:px-6 text-right">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              New Message
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
