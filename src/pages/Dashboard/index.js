import React, { useEffect } from "react"
import MetaTags from "react-meta-tags"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const Dashboard = () => {
  useEffect(() => {
  }, [])
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Dashboard | WyCoin</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Dashboard" breadcrumbItem="Starter Page" />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
