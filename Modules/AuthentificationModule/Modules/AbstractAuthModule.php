<?php

abstract class AbstractAuthModule
{
    protected $server;
    protected $port;

    protected $username;
    protected $first_name;
    protected $last_name;
    protected $student_number;
    protected $email;
    protected $institution;
    protected $loginType;

    public function setServer($server, $port)
    {
        $this->server = $server;
        $this->port = $port;
    }

    abstract public function getModuleName();

    abstract protected function init();

    abstract public function authentificate($username, $password);

    public function getUserName()
    {
        return $this->username;
    }

    public function getFirstName()
    {
        return isset($this->firstName) ? $this->firstName : "";
    }

    public function getLastName()
    {
        return isset($this->lastName) ? $this->lastName : "";
    }

    public function getStudentNumber()
    {
        return isset($this->studentNumber) ? $this->studentNumber : "";
    }

    public function getEmail()
    {
        return isset($this->email) ? $this->email : "";
    }

    public function getInstitution()
    {
        return isset($this->institution) ? $this->institution : "";
    }

    public function __construct()
    {
        $this->init();
    }

}

?>