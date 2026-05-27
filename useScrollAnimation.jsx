import { useEffect, useRef } from 'react'

const useScrollAnimation = (delay = 0) => {
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible')
                    }, delay)
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px'  }
        )

        if (ref.current) observer.observe(ref.current)

        return () => observer.disconnect()
    }, [])

    return ref
}

export default useScrollAnimation