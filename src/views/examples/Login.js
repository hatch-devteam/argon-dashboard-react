// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Container,
} from "reactstrap";

const Login = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div className="text-center">
        
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  onClick={() => (window.location.href = "/admin/dashboard")}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="Microsoft"
                      src={require("../../assets/img/icons/common/microsoft.svg")}
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
  );
};

export default Login;
