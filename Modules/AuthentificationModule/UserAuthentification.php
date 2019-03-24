<?php
function classAutoloader($class)
{
    $dir = 'Modules/AuthentificationModule/Modules';
    $fname1 = "$dir/$class/$class.php";
    $fname2 = "$dir/$class.php";
    if (file_exists($fname1))
        include $fname1;
    else
        include $fname2;

}

spl_autoload_register('classAutoloader');

class UserAuthentification
{

    private $availableModules;

    private $username;
    private $firstName;
    private $lastName;
    private $institution;
    private $email;
    private $studentNumber;
    private $authName;

    public function getUsername()
    {
        return $this->username;
    }

    public function getFirstName()
    {
        return $this->firstName;
    }

    public function getLastName()
    {
        return $this->lastName;
    }

    public function getInstitution()
    {
        return $this->institution;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getStudentNumber()
    {
        return $this->studentNumber;
    }

    public function getAuthName()
    {
        return $this->authName;
    }

    /**
     * This function parses all available modules in module path.
     * It is automatically called on initialization but also
     * publicly callable for rescanning.
     */
    public function parseAvailableModules()
    {
        $this->availableModules = array();

        $dir = 'Modules/AuthentificationModule/Modules';
        $filesAndFolders = scandir($dir);

        foreach ($filesAndFolders as $name)
            if (is_dir("$dir/$name"))
                if (file_exists("$dir/$name/$name.php")) {
                    $module = new $name;
                    $this->availableModules[$name] = $module->getModuleName();
                    unset($module);
                }
    }

    private function init()
    {
        $this->parseAvailableModules();
    }

    function __construct()
    {
        $this->init();
    }

    public function tryAuth($module, $username, $password)
    {
        $tmpObj = new $module;
        $result = $tmpObj->authentificate($username, $password);

        if ($result) {
            $this->username = $username;
            $this->firstName = $tmpObj->getFirstName();
            $this->lastName = $tmpObj->getLastName();
            $this->institution = $tmpObj->getInstitution();
            $this->studentNumber = $tmpObj->getStudentNumber();
            $this->email = $tmpObj->getEmail();
        }

        unset($tmpObj);
        return $result;
    }

    public function tryAnyAuth($username, $password)
    {
        $authSuccessfull = false;
        $this->authName = 'LDB';
        if (isset($this->availableModules['LDB']))
            $authSuccessfull = $this->tryAuth($this->authName, $username, $password);

        if (!$authSuccessfull)
            foreach ($this->availableModules as $name => $description)
                if ($name != 'LDB') {
                    $this->authName = $name;
                    $authSuccessfull = $this->tryAuth($name, $username, $password);
                    if ($authSuccessfull)
                        break;
                }
        return $authSuccessfull;
    }

    function getAvailableModules()
    {
        return $this->availableModules;
    }

}