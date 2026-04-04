import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { LoadingProvider } from '../src/context/LoadingProvider'

const MainContainer = dynamic(() => import('../src/components/MainContainer'), { ssr: false })
const CharacterModel = dynamic(() => import('../src/components/Character'), { ssr: false })

export default function Home() {
  return (
    <LoadingProvider>
      <Suspense fallback={null}>
        <MainContainer>
          <Suspense fallback={null}>
            <CharacterModel />
          </Suspense>
        </MainContainer>
      </Suspense>
    </LoadingProvider>
  )
}
