import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { HomeHero } from '../components/HomeHero'
import { HomeCards } from '../components/HomeCards'

/** Homepage: hero + about + four navigation cards + contact. */
export function HomePage() {
  return (
    <>
      <HomeHero />
      <About />
      <HomeCards />
      <Contact />
    </>
  )
}
