import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import axios from "axios";
import Header from "components/Headers/Header.js";
import apiConfig from "../../config/apiConfig";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchField, setSearchField] = useState('email');
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: ''
  });

  const toggle = () => {
    setModal(!modal);
    setError(null);
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiConfig.baseURL}dashboard/createUser`,
        newUser,
        { headers: { 'Content-Type': 'application/json' } }
      );
      fetchUsers();
      setModal(false);
      setNewUser({ first_name: '', last_name: '', email: '', password: '', phone: '' });
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error creating user. Please try again later.";
      setError(errorMessage);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const usersToUpdate = selectedUsers.map(userId => ({
        id: userId,
        status: newStatus === 'active' ? 1 : 0
      }));

      await axios.post(
        `${apiConfig.baseURL}dashboard/updateusersstatus`,
        { users: usersToUpdate },
        { headers: { 'Content-Type': 'application/json' } }
      );

      fetchUsers();
      setSelectedUsers([]);
    } catch (err) {
      console.error('Error updating user status:', err);
      setError("Error updating user status. Please try again later.");
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const getAllUsers = async() => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${apiConfig.baseURL}dashboard/getallusers`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setUsers(response.data.users || []);
      setTotalPages(response.data.pagination?.last_page || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError("Error fetching users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async() => {
    try {
      setLoading(true);
      const searchParams = {
        email: '',
        first_name: '',
        last_name: '',
        per_page: 10,
        page: currentPage
      };
      if (searchTerm) {
        console.log('Searching for:', searchTerm); // Add this line to check the search term
        searchParams[searchField] = searchTerm;
      }
      const response = await axios.post(
        `${apiConfig.baseURL}dashboard/searchUsers`,
        searchParams,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setUsers(response.data.users || []);
      setTotalPages(response.data.pagination?.last_page || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError("Error fetching users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (loading) return (
  <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Users</h3>
                <div className="d-flex align-items-center">
                  <Input type="select" className="mr-2" style={{width: '120px'}} value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                    <option value="email">Email</option>
                    <option value="first_name">First Name</option>
                    <option value="last_name">Last Name</option>
                  </Input>
                  <Input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <Button color="primary" onClick={fetchUsers} className="ml-2">
                    Search
                  </Button>
                  <Button color="secondary" onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                    getAllUsers();
                  }} className="ml-2">
                    Clear
                  </Button>
                  <Button color="primary" onClick={toggle} className="mr-3 ml-2" style={{width: 'auto'}}>
                    Create User
                  </Button>
                  {selectedUsers.length > 0 && (
                    <UncontrolledDropdown>
                      <DropdownToggle caret color="primary">
                        Update Status
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleStatusUpdate('active')}>Activate</DropdownItem>
                        <DropdownItem onClick={() => handleStatusUpdate('inactive')}>Deactivate</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  )}
                </div>
              </CardHeader>

              <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Create New User</ModalHeader>
                {error && (
                  <div className="alert alert-danger mx-3 mt-3" role="alert">
                    {error}
                  </div>
                )}
                <ModalBody>
                  <Form onSubmit={handleCreateUser}>
                    <FormGroup>
                      <Label for="name">First Name</Label>
                      <Input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder="Enter First Name"
                        value={newUser.first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="name">Last Name</Label>
                      <Input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder="Enter Last Name"
                        value={newUser.last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="phone">Phone</Label>
                      <Input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="Enter phone number"
                        value={newUser.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={handleCreateUser}>Create</Button>
                  <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
              </Modal>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Select</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">ID</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`checkbox-${user.id}`}
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleCheckboxChange(user.id)}
                            />
                            <label className="custom-control-label" htmlFor={`checkbox-${user.id}`}></label>
                          </div>
                        </td>
                        <th scope="row">
                          <Media className="align-items-center">
                            <a
                              className="avatar rounded-circle mr-3"
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              <img
                                alt="User Avatar"
                                src={
                                  user.avatar || require("../../assets/img/theme/team-1-800x800.jpg")
                                }
                              />
                            </a>
                            <Media>
                              <span className="mb-0 text-sm">{user.first_name || "N/A"}</span>
                            </Media>
                          </Media>
                        </th>
                        <td>{user.last_name || "N/A"}</td>
                        <td>{user.email || "N/A"}</td>
                        <td>
                          <Badge color={user.status === "active" ? "success" : "danger"}>
                            {user.status || "Unknown"}
                          </Badge>
                        </td>
                        <td>{user.id || "N/A"}</td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                                Edit
                              </DropdownItem>
                              <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="Page navigation">
                  <Pagination className="pagination justify-content-end mb-0">
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageClick(currentPage - 1);
                        }}
                      >
                        <i className="fas fa-angle-left" />
                      </PaginationLink>
                    </PaginationItem>
                    {Array(totalPages).fill().map((_, index) => (
                      <PaginationItem key={index} active={currentPage === index + 1}>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageClick(index + 1);
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageClick(currentPage + 1);
                        }}
                      >
                        <i className="fas fa-angle-right" />
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Users;
