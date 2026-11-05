import { HomeHero } from '../components/HomeHero'
import { FeaturedProjects } from '../components/FeaturedProjects'
import { Skills } from '../sections/Skills'
import { About } from '../sections/About'
import { HomeCards } from '../components/HomeCards'
import { Contact } from '../sections/Contact'

/**
 * Homepage: Hero + Featured Projects + Skills Matrix + About + Navigation cards + Contact.
 */
export function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedProjects />
      <Skills />
      <About />
      <HomeCards />
      <Contact />
    </>
  )
}
