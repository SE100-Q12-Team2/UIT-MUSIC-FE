const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full px-6 py-8 lg:px-0">
      {children}
    </div>
  )
}

export default PageContainer