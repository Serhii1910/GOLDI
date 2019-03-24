<?php

class LDAP_TUI extends AbstractAuthModule
{

    protected function init()
    {
        $this->setServer("ldaps://ldapauth.tu-ilmenau.de", "636");
        $this->institution = "TU Ilmenau";
    }

    public function getModuleName()
    {
        $LanguageManagement = new LanguageManager();
        return $LanguageManagement->GetHomepageTranslation("LDAPTUI");
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
            $ldapBind = ldap_bind($ldapCon, "cn=" . $username . ",ou=user,o=uni", $password);
        } catch (Exception $e) {
            return false;
        }
        if (!$ldapBind) return false;

        $searchForUser = ldap_search($ldapCon, "cn=" . $username . ",ou=user,o=uni", "cn=*");
        $all = ldap_get_entries($ldapCon, $searchForUser);

        $this->username = $username;
        $this->email = $all[0]["mail"][0];
        $this->studentNumber = $all[0]["thuedustudentnumber"][0];
        $this->firstName = $all[0]["givenname"][0];
        $this->lastName = $all[0]["sn"][0];

        return true;
    }

}

?>