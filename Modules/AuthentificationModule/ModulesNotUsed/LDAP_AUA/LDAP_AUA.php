<?php

class LDAP_AUA extends AbstractAuthModule
{

    protected function init()
    {
        $this->setServer("ldap://ammabw0101.aua.am", "389");
        $this->institution = "American University of Armenia";
    }

    public function getModuleName()
    {
        $LanguageManagement = new LanguageManager();
        return $LanguageManagement->GetHomepageTranslation("LDAPAUA");
    }

    function myErrorHandler($fehlercode, $fehlertext, $fehlerdatei, $fehlerzeile)
    {
        return true;
    }

    public function authentificate($username, $password)
    {
        $alter_error_handler = set_error_handler(array(&$this, "myErrorHandler"));

        $ldapCon = ldap_connect($this->server, $this->port);
        if (!$ldapCon) return false;

        try {
//            $ldapBind = ldap_bind($ldapCon, "dc=auaad,dc=aua,dc=am");
            $ldapBind = ldap_bind($ldapCon, $username."@auaad.aua.am", $password);
//            echo ldap_error($ldapCon);
//            exit;
        } catch (Exception $e) {
            return false;
        }
        if (!$ldapBind) return false;

        $searchForUser = ldap_search($ldapCon, "dc=auaad,dc=aua,dc=am", "cn=".$username);
        $all = ldap_get_entries($ldapCon, $searchForUser);

        $this->username = $username;
        $this->email = $all[0]["mail"][0];
        $this->studentNumber = $all[0]["thuedustudentnumber"][0];
        $this->firstName = $all[0]["givenname"][0];
        $this->lastName = $all[0]["sn"][0];

        return true;
    }

}
