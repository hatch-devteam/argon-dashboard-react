import { Container, Row, Col, Card, CardHeader, Button } from "reactstrap";
import { useMsal } from "@azure/msal-react";

const Login = () => {
  const { instance } = useMsal();

  const handleMicrosoftLogin = async () => {
    try {
      await instance.loginPopup({
        scopes: ["user.read", "email"],
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="header bg-gradient-info py-7 py-lg-8">
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <h1 className="text-white">Welcome!</h1>
                  <p className="text-lead text-light">
                    Sign in to access your dashboard
                  </p>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Col lg="5" md="7">
              <Card className="bg-secondary shadow border-0">
                <CardHeader className="bg-transparent pb-5">
                  <div className="text-muted text-center mt-2 mb-3">
                    <small>Sign in with</small>
                  </div>
                  <div className="btn-wrapper text-center">
                    <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      onClick={handleMicrosoftLogin}
                    >
                      <span className="btn-inner--icon">
                        <img
                          alt="..."
                          src={require("../../assets/img/icons/common/microsoft.svg").default}
                        />
                      </span>
                      <span className="btn-inner--text">Microsoft</span>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>

  );
};

export default Login;