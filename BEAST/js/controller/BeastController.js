/**
 * Created by mseeber on 5/10/17.
 */
///<reference path="./common.ts" />
///<reference path="../model/model.ts" />
///<reference path="../fancytree/treeController.ts" />
///<reference path="../d_ts/jquery.d.ts" />
///<reference path="../d_ts/simcir.d.ts" />
/**
 * This class contains all startup logic for BEAST and thus marks the entry point
 * when using beast.
 */
class BeastController {
    constructor(Callback, localStoragePrefix = "") {
        this.persistenceController = new PersistenceController(this, localStoragePrefix);
        this.initDefaultProject(() => {
            this.treeController = new TreeController(this);
            this.workspaceController = new WorkspaceController(this);
            this.menubarController = new MenubarController(this);
            this.workspaceController.resetEditors();
            if (Callback !== undefined)
                Callback();
        });
        if (window.location.href.search("loadBeastFile") !== -1) {
            $.getJSON(window.location.href.match(/[^?]*\?[^=]*=(.*)/)[1], (data) => {
                if (data !== null)
                    this.persistenceController.setCurrentProject(this.persistenceController.loadProjectFromJSON(JSON.stringify(data)));
            });
        }
    }
    /**
     * Adds the version number as content to all HTML elements with the version-label class.
     */
    initVersion() {
        //TODO maybe move into editor Controller or menubar controller?
        $('.version-label')
            .append(BeastController.BEAST_VERSION);
    }
    invalidBEASTSession() {
        InfoDialog.showDialog('Multiple instances of BEAST are not allowed!');
    }
    /**
     * returns true if the current project is dirty (retains unsaved state)
     * @returns {boolean}
     */
    isDirty() {
        return this.persistenceController.isDirty();
    }
    /**
     * Creates a new project and switches to it
     */
    createNewProject() {
        this.persistenceController.createNewProject();
    }
    listProjects() {
        return this.persistenceController.getProjects();
    }
    /**
     * Loads project of the specified name
     */
    loadProject(name) {
        this.persistenceController.loadProject(name);
    }
    /**
     * returns the Library of the given key or null if no
     * Library with the given key exists.
     *
     * @param id Project-unique Library ID
     * @returns {any} Library or null
     */
    resolveLibrary(id) {
        switch (id) {
            //handle the special libs
            case this.basicComponentsLib.ID:
                return this.basicComponentsLib;
            case this.basicComplexComponentsLib.ID:
                return this.basicComplexComponentsLib;
            //handle the user libs
            default:
                let userLibraries = this.persistenceController.getLibraries();
                for (let lib of userLibraries) {
                    if (lib.ID == id) {
                        return lib;
                    }
                }
                //lib not found
                return null;
        }
    }
    /**
     * Returns a Component Type from it's global ID
     *
     * @param id
     * @returns {Component} Component or null if no Component with corresponding key is found
     */
    resolveComponentType(id) {
        let lib = this.resolveLibrary(id.libraryID);
        //in case an invalid lib ID is delivered
        if (null == lib) {
            return null;
        }
        for (let component of lib.components) {
            if (component.ID == id.componentID) {
                return component;
            }
        }
        //component not found
        return null;
    }
    /**
     * modelChanged() is called when the model is changed.
     */
    modelChanged() {
    }
    /**
     * projectChanged() is called when the project is changed.
     */
    projectChanged() {
        const oldSI = this.getSimulationInterface();
        this.checkForDepositLibrary();
        this.treeController.reloadTree();
        this.workspaceController.resetEditors();
        const newSI = this.getSimulationInterface();
        oldSI.transferCallbacks(newSI);
    }
    checkForDepositLibrary() {
        let userLibraries = this.persistenceController.getLibraries();
        for (const lib of userLibraries) {
            if (lib.ID === BeastController.DEPOSIT_LIB_ID) {
                return;
            }
        }
        userLibraries.push(new Library(BeastController.DEPOSIT_LIB_ID, 'Deposit'));
    }
    /**
     * This loads the default project and initializes also the basic libraries.
     * If the default project is a new empty project, the deposit gets added to the projects
     * persistent libraries.
     */
    initDefaultProject(Callback) {
        this.basicComponentsLib = new Library(BeastController.BASIC_LIB_ID, 'Basic Components');
        this.basicComponentsLib.components = BeastController.basicComponents;
        this.persistenceController.loadStaticLibrary('BEAST/assets/beast-basic-compound.bdcl', (result) => {
            this.basicComplexComponentsLib = result;
            this.checkForDepositLibrary();
            Callback();
        });
    }
    /**
     * Checks if the specified Library is a basic read only Library
     *
     * @param library
     */
    static isReadOnlyLibrary(libraryID) {
        //is there a match in the list?
        return (BeastController.READ_ONLY_LIB_IDS.indexOf(libraryID) > -1);
    }
    /**
     * FIXME comment
     * TODO is this still used by the Workspace interface?
     * @param component
     * @param id
     */
    componentModified(component, id) {
        console.assert(component.ID === id.componentID);
        if (id.componentID == 'project') {
            this.persistenceController.getCurrentProject().circuit = component;
        }
        else {
            const lib = this.resolveLibrary(id.libraryID);
            console.assert(lib !== null);
            for (let i in lib.components) {
                if (lib.components[i].ID == id.componentID) {
                    lib.components[i] = component;
                }
            }
        }
        this.persistenceController.markDirty();
    }
    /**
     * Checks if the given LibraryID equals one of the basic libraries
     * @param libraryID ID to check
     * @returns {boolean} true, if ID equals one of the basic libraries
     */
    static isBasicLibrary(libraryID) {
        return libraryID === BeastController.BASIC_LIB_ID || libraryID === BeastController.BASIC_COMPOUND_LIB_ID || libraryID === BeastController.DEPOSIT_LIB_ID;
    }
    /**
     * Checks if the given global id refers to a basic component.
     * //TODO deprecated by the fact, that we use separate classes now
     * @param id
     * @returns {boolean}
     */
    isBasicComponentType(id) {
        let lib = this.resolveLibrary(id.libraryID);
        //There is only one basic lib with basic omponents
        //All other libs contain Compound Components
        return (lib.ID == BeastController.BASIC_LIB_ID);
    }
    /**
     * Puts a new component with the desired Name into the deposit of the current project
     * and returns the component.
     *
     * On Failure, null is returned and no Component is inserted ino the deposit
     *
     * @return {}
     */
    createComponent(component) {
        //TODO maybe better handling?
        const name = (component instanceof CompoundComponent) ? component.name : component;
        const id = PersistenceController.generateComponentId(name);
        if (component instanceof CompoundComponent) //Cannot check for instanceof string
         {
            component = new CompoundComponent(id, component.name, component.devices, component.connectors);
        }
        else {
            component = new CompoundComponent(id, component, [], []);
        }
        const globalId = new GlobalComponentTypeID(BeastController.DEPOSIT_LIB_ID, id);
        const lib = this.resolveLibrary(globalId.libraryID);
        console.assert(lib !== null);
        lib.addComponent(component);
        this.treeController.addComponent(globalId);
        this.persistenceController.markDirty();
        return globalId;
    }
    createAndOpenComponent(component) {
        this.workspaceController.openComponent(this.createComponent(component));
    }
    reorderComponentAfter(startComponentID, insertComponentID) {
        const libArr = this.resolveLibrary(startComponentID.libraryID).components;
        const startComp = this.resolveComponentType(startComponentID);
        const insertComp = this.resolveComponentType(insertComponentID);
        if (startComp && insertComp) {
            arrayRemoveElementOnce(libArr, insertComp);
            libArr.splice(libArr.indexOf(startComp) + 1, 0, insertComp);
            this.persistenceController.markDirty();
            return true;
        }
        return false;
    }
    /**
     * Deletes a single Component from the Project, specified by it's key
     * If the component can not be deleted due to dependencies,
     * this method returns false else true.
     *
     * @param key the global key of the component as string TODO new key format
     * @returns {boolean} false if the component can not be deleted.
     */
    deleteSingleComponent(key) {
        let containingLib = this.resolveLibrary(key.libraryID);
        if (null == containingLib) {
            return false;
        }
        if (BeastController.isReadOnlyLibrary(containingLib.ID)) {
            return false;
        }
        let component = this.resolveComponentType(key);
        if (component == null) {
            //component not found
            return false;
        }
        let blockingDependencies = [];
        for (let c of containingLib.components) {
            //Cast is safe because we know it is a user lib at this point
            let comp = c;
            if (comp.directlyDependsOn(key)) {
                blockingDependencies.push(comp.ID);
            }
        }
        if (blockingDependencies.length == 0) {
            containingLib.removeComponent(component);
            this.persistenceController.markDirty();
            return true;
        }
        else {
            let msg = 'Can not delete Compoenent ' + component.name +
                ' from Library ' + containingLib.name +
                ' since following components in Library ' + containingLib.name +
                ' depend on it: <br>';
            for (let ID of blockingDependencies) {
                msg = msg.concat('<br>').concat(ID);
            }
            InfoDialog.showDialog(msg);
            return false;
        }
    }
    /**
     * Creates a copy of the Component behind the specified Global Component ID
     * in the Library specified by the targetLibraryID.
     *
     * This operation may fail due to overlapping IDs
     * @param componentID
     * @param targetLibraryID
     * @return {GlobalComponentTypeID | null}
     */
    copyComponent(componentID, targetLibraryID) {
        //check if component is not moved over library boundary
        if (componentID.libraryID == targetLibraryID) {
            //do nothing
            return null;
        }
        //TODO change error signaling
        let targetLibrary = this.resolveLibrary(targetLibraryID);
        if (BeastController.isReadOnlyLibrary(targetLibrary.ID)) {
            InfoDialog.showDialog('Library: '.concat(targetLibrary.name)
                .concat(' is read only.'));
            return null;
        }
        if (this.isBasicComponentType(componentID)) {
            InfoDialog.showDialog('Basic components can not be copied into other libraries.');
            return null;
        }
        //check if ID collides in target library
        let newTargetComponentID = new GlobalComponentTypeID(targetLibraryID, componentID.componentID);
        {
            let testTarget = this.resolveComponentType(newTargetComponentID);
            if (null != testTarget) {
                InfoDialog.showDialog('The component: '.concat(testTarget.name)
                    .concat(' already exists in Library: ').concat(targetLibrary.name));
                return null;
            }
        }
        let sourceComponent = this.resolveComponentType(componentID);
        //all dependencies are resolved now, so conflicts and problems can be detected before
        //actually copying anything
        //extract all dependecies that need to be copied
        let copyDependencies = [];
        for (let d of sourceComponent.listAllDependencies(this)) {
            //exclude all the read only components
            if (!BeastController.isReadOnlyLibrary(d.libraryID)) {
                copyDependencies.push(d);
            }
        }
        if (copyDependencies.length != 0) {
            let msg = 'The source component ' + sourceComponent.name + ' dependes on the following components.';
            for (let d of copyDependencies) {
                msg = msg.concat('<br>').concat(d.libraryID + ' ' + d.componentID);
            }
            InfoDialog.showDialog(msg);
        }
        //also copy all dependencies that must be copied
        for (let d of copyDependencies) {
            this.copyComponent(d, targetLibraryID);
        }
        let newComponent = sourceComponent.copy();
        targetLibrary.components.push(newComponent);
        this.treeController.addComponent(newTargetComponentID);
        this.persistenceController.markDirty();
        return newTargetComponentID;
    }
    /**
     * Deletes a user defined Library from the current project if there are
     * no dependencies in the main circuit.
     *
     * @param libID
     * @returns {boolean}
     */
    deleteLibrary(libID) {
        let lib = this.resolveLibrary(libID);
        //check if lib is read only and valid
        if (null == lib) {
            return false;
        }
        if (BeastController.isBasicLibrary(lib.ID)) {
            return false;
        }
        //FIXME check for dependencies in the work area
        let projectLibs = this.persistenceController.getLibraries();
        arrayRemoveElementOnce(projectLibs, lib);
        this.persistenceController.markDirty();
        return true;
    }
    reorderLibraryAfter(startLibID, insertLibID) {
        const startLib = this.resolveLibrary(startLibID);
        const insertLib = this.resolveLibrary(insertLibID);
        if (startLib && insertLib) {
            const libs = this.persistenceController.getLibraries();
            arrayRemoveElementOnce(libs, insertLib);
            libs.splice(libs.indexOf(startLib) + 1, 0, insertLib);
            this.persistenceController.markDirty();
            return true;
        }
        return false;
    }
    /**
     * Adds the specified library to the current project,
     * checking for name collisions.
     *
     * @param newLib the specified library
     * @returns {any} null on faulure, the specified lib on succes
     */
    addLibrary(newLib) {
        let libs = this.getLibraries();
        // verify that the new Library does not collide in name or ID
        // with any of the existing libs
        for (let lib of libs) {
            if (lib.name == newLib.name || lib.ID == newLib.ID) {
                //TODO rather throw an exception?
                //indicate error by returning null
                return null;
            }
        }
        this.persistenceController.getCurrentProject()
            .pushLibrary(newLib);
        this.treeController.addLibrary(newLib);
        this.persistenceController.markDirty();
        return newLib;
    }
    /**
     * Creates a new Library in the current project with the given Name and assigns an ID to it.
     * Currently no sanity checks made, but IDs should hav fairly low probability of collision.
     * //TODO assure unique IDs
     * A reference on the newly created Instance is returned or null in case of failure.
     *
     * @param name
     * @returns {Library}
     */
    createLibrary(name) {
        let newID = PersistenceController.generateComponentId(name);
        let newLib = new Library(newID, name);
        if (this.addLibrary(newLib) == null) {
            //could not add Library due to name collision
            return null;
        }
        return newLib;
    }
    /**
     * Imports the specified file as a new library
     * @param file
     */
    importLibrary(file) {
        const controller = this;
        this.persistenceController.loadLibraryFromFile(file, function (lib) {
            if (lib != null) {
                if (controller.addLibrary(lib) == null) {
                    InfoDialog.showDialog('Can\'t import this library: a library with this name already exists!');
                }
            }
            else {
                InfoDialog.showDialog('Can\'t import this library: invalid file content!');
            }
        });
    }
    /**
     * Initiates a Download for the given Library to a File with the given fileName.
     * @param fileName
     * @param lib
     */
    downloadLibrary(fileName, lib) {
        PersistenceController.downloadAsFile(fileName, lib);
    }
    /**
     *
     * @returns {PersistenceController}
     */
    getPersistenceController() {
        return this.persistenceController;
    }
    /**
     * Registers a component as a basic component to BEAST
     * Registered components can later be referenced in the
     * Library for basic components
     */
    static registerDefaultComponent(component) {
        BeastController.basicComponents.push(component);
    }
    /**
     * returns a list of all available libraries even read only ones
     *
     * @returns {Array<Library>}
     */
    getLibraries() {
        let libraries = Array();
        libraries.push(this.basicComponentsLib);
        libraries.push(this.basicComplexComponentsLib);
        //concat does not mutate original array, therefor assignment is needed
        libraries = libraries.concat(this.persistenceController.getLibraries());
        return libraries;
    }
    /**
     * Returns a list of Libraries which can be exported.
     * Changes to this list are not carried over to the persistence layer,
     * chenges to the containing libs are carried over though.
     *
     * @returns {Array}
     */
    getExportableLibraries() {
        //create a new list and do not include the deposit
        let libraries = [];
        for (let lib of this.persistenceController.getLibraries()) {
            if (lib.ID != BeastController.DEPOSIT_LIB_ID) {
                libraries.push(lib);
            }
        }
        return libraries;
    }
    getSimulationInterface() {
        return this.workspaceController.getSimulationInterface();
    }
    reinitUI() {
        this.workspaceController.reinitUI();
    }
}
/**
 * BEAST-Version
 * @type {string}
 */
BeastController.BEAST_VERSION = '1.0.0';
BeastController.BASIC_LIB_ID = 'beast-basic';
BeastController.BASIC_COMPOUND_LIB_ID = 'beast-basic-compound';
BeastController.DEPOSIT_LIB_ID = 'beast-deposit';
BeastController.READ_ONLY_LIB_IDS = [BeastController.BASIC_LIB_ID, BeastController.BASIC_COMPOUND_LIB_ID];
BeastController.basicComponents = [];
//# sourceMappingURL=BeastController.js.map