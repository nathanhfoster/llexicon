class Category {
  constructor() {
    this.Permissions = new Array();
  }
  pushPermissions = permission => this.Permissions.push(permission);
  getCode = name => {
    const p = this.Permissions.findIndex(p => p.title == name);
    return p != -1 ? this.Permissions[p].id : p;
  };
  getName = code => {
    const p = this.Permissions.findIndex(p => p.id == code);
    return p != -1 ? this.Permissions[p].category : p;
  };
}

class Permission {
  constructor(permission) {
    const { id, name, codename, content_type } = permission;
    this.id = id;
    this.name = name;
    this.codename = codename;
    this.content_type = content_type;
    this.category = codename.split("_")[0];
    this.header = this.category.toUpperCase();
    this.title = name
      .split(" ")
      .splice(2)
      .map(e => e.charAt(0).toUpperCase() + e.slice(1))
      .join(" ");
  }
}

class UserHasPermissionTo {
  Add = new Category();
  View = new Category();
  Change = new Category();
  Delete = new Category();
  constructor(allUserPermissions) {
    const { length } = allUserPermissions;
    for (let i = 0; i < length; i++) {
      const permission = allUserPermissions[i];
      const codename = permission.codename.split("_")[0];
      if (codename == "add") this.Add.pushPermissions(new Permission(permission));
      if (codename == "view") this.View.pushPermissions(new Permission(permission));
      if (codename == "change") this.Change.pushPermissions(new Permission(permission));
      if (codename == "delete") this.Delete.pushPermissions(new Permission(permission));
    }
  }
}

export { UserHasPermissionTo };
