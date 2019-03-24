<?php

class LDB extends AbstractAuthModule
{
    protected function init()
    {
        $this->institution = "TU Ilmenau/Fallback";
    }

    public function getModuleName()
    {
        $LanguageManagement = new LanguageManager();
        return $LanguageManagement->GetHomepageTranslation("LDBName");
    }

    public function authentificate($username, $password)
    {
        $Result = Database::User_Authentificate($username, $password);

        //TODO Error-Rückgabe-Objekt analysieren und entsprechende Fehler an die anfragende Stellte durchreichen
        if(isset($Result["error"])){
            return false;
        }

        if(isset($Result["success"])){
            $Obj = $Result["success"];
            $this->username = $Obj['Username'];
            $this->first_name = $Obj['FirstName'];
            $this->last_name = $Obj['LastName'];
            $this->student_number = $Obj['StudentNumber'];
            $this->email = $Obj['Email'];
            return $Obj['UserID'];
        }

        return false;
    }
}
