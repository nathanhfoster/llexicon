const useScrollable = onScrollEvent => {
  const { scrollHeight, scrollTop, clientHeight } = onScrollEvent.target

  const reachedBottom = scrollHeight - scrollTop === clientHeight

  console.log(reachedBottom)

  return { reachedBottom }
}

export default useScrollable
