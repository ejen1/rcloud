rcloud.config.get.notebooks.discover <- function(order = "recently.modified") {
  switch(order,
    recently.modified = rcloud.config.get.recently.modified.notebooks()
    )
}

rcloud.config.get.recently.modified.notebooks <- function() {
  users <- rcloud.get.users()
  keys = unlist(lapply(usr.key(user = users, notebook = "system",
                               "config", "recently-modified", "*"), rcs.list))
  vals <- rcs.get(keys, list=TRUE)
  names(vals) <- gsub(".*/", "", names(vals))
  vals
}

rcloud.config.set.recently.modified.notebook <- function(id, date) {
  rcs.set(usr.key(user=.session$username, notebook="system", "config", "recently-modified", id), date)
}