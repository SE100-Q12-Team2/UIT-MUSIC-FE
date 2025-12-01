const MaxWidth = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-0 sm:px-4 lg:px-0">
      {children}
    </div>
  )
}

export default MaxWidth