const IsLoading = ({ loadingMessage }: { loadingMessage: string }) => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
      <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-lg">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />

        <span className="text-sm font-medium text-gray-700">
          {loadingMessage}...
        </span>
      </div>
    </div>
  )
}

export default IsLoading
