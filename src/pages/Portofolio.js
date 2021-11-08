import React, { useEffect } from "react"
import MetaTags from "react-meta-tags"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../components/Common/Breadcrumb"
import { useDispatch } from "react-redux"
import { getChartsData } from "../store/actions"

const Dashboard = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getChartsData())
  }, [])
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Portofolio | WyCoin</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Portofolio" breadcrumbItem="Page" />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
