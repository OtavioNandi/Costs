import { useState, useEffect } from 'react'
import { Message } from '../layout/Message'
import { useLocation } from 'react-router-dom'
import styles from './Projects.module.css'
import { Container } from '../layout/Container'
import { LinkButton } from '../layout/LinkButton'
import { ProjectCard } from '../project/ProjectCard'
import { Loading } from '../layout/Loading'


export const Projects = () => {

  const [projects, setProjects] = useState([])
  const [removeLoading, setRemoveLoading] = useState(false)
  const [projectMessage, setProjectMessage] = useState('')

  const location = useLocation()
  let message = ''
  if (location.state) {
    message = location.state.message
  }

  useEffect(() => {
    setTimeout(() => {
      fetch("http://localhost:5000/projects", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data)
          setProjects(data)
          setRemoveLoading(true)
        })
        .catch((err) => console.log(err))
    }, 500)
  }, [])

  function removeProject(id) {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((resp) => resp.json())
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id))
        setProjectMessage('Project removed successfully!')
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>My Projects</h1>
        <LinkButton to="/newproject" text="Create Project" />
      </div>
      {message && <Message type="success" msg={message} />}
      {projectMessage && <Message type="success" msg={projectMessage} />}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard 
              id={project.id}
              name={project.name} 
              budget={project.budget} 
              category={project?.category?.name} 
              key={project.id}
              handleRemove={removeProject} 
            />
          )
        )}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0  && (
          <h1>You have no projects yet : <span>&#40;</span> </h1>
          )
        }
      </Container>
    </div>
  )
}
