import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Loading } from '../layout/Loading'
import { Container } from '../layout/Container'
import { ProjectForm } from '../project/ProjectForm'
import { Message } from '../layout/Message'
import { ServiceForm } from '../service/ServiceForm'
import { parse, v4 as uuidv4 } from 'uuid'
import { ServiceCard } from '../service/ServiceCard'

export const Project = () => {

    const { id } = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data)
                    setServices(data.services)
                })
                .catch((err) => console.log(err))
        }, 500)
    }, [id])

    function editPost(project) {
        setMessage('')

        if(project.budget < project.cost) {
            setMessage('Negative value!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                setMessage('Project updated successfully!')
                setType('success')
            })
            .catch((err) => console.log(err))
    }

    function createService(project) {
        setMessage('')

        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)) {
            setMessage('Total budget already reached!')
            setType('error')
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setShowServiceForm(false)
            })
            .catch((err) => console.log(err))
    }

    function removeService(id, cost) {
        const servicesUpdated = project.services.filter((service) => service.id !== id)

        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(projectUpdated)
                setServices(servicesUpdated)
                setMessage('Service removed successfully!')
                setType('success')
            })
            .catch((err) => console.log(err))
    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }
    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} /> }
                        <div className={styles.details_container}>
                            <h1>Project: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Edit project' : 'Close X'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Category: </span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total Budget: </span> R$ {project.budget}
                                    </p>
                                    <p>
                                        <span>Total Amount Used: </span> R$ {project.cost}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost} btnText="Finish Edit" projectData={project} />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Add a service:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Add service' : 'Close X'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm
                                        handleSubmit={createService}
                                        btnText="Add service"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>
                        <h2>Services</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard 
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {services.length === 0 && <p>This project has no services yet : <span>&#40;</span> </p>}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}
