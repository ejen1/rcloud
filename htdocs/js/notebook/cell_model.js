Notebook.Cell.create_model = function(content, language)
{
    var id_ = -1;
    var is_selected_ = false;
    var result = Notebook.Buffer.create_model(content, language);
    var base_change_object = result.change_object;

    _.extend(result, {
        id: function(new_id) {
            if (!_.isUndefined(new_id) && new_id != id_) {
                id_ = new_id;
                this.notify_views(function(view) {
                    view.id_updated();
                });
            }
            return id_;
        },
        filename: function() {
            if(arguments.length)
                throw new Error("can't set filename of cell");
            return Notebook.part_name(this.id(), this.language());
        },
        get_execution_snapshot: function() {
            // freeze the cell as it is now, to execute it later
            var language = this.language() || 'Text'; // null is a synonym for Text
            var version = this.parent_model.controller.current_version();
            if(!version)
                RCloud.UI.session_pane.append_text('Warning: executing unknown version, may be stale\n');
            return {
                controller: this.controller,
                json_rep: this.json(),
                partname: Notebook.part_name(this.id(), language),
                language: language,
                version: version
            };
        },
        set_focus: function() {
            this.notify_views(function(view) {
                view.edit_source(true);
                view.scroll_into_view(true);
            });
        },
        deselect_cell: function() {
            is_selected_ = false;

            this.notify_views(function(view) {
                view.selected_updated();
            });

            return is_selected_;
        },
        select_cell: function() {
            is_selected_ = true;

            this.notify_views(function(view) {
                view.selected_updated();
            });

            return is_selected_;
        },
        toggle_cell: function() {
            is_selected_ = !is_selected_;

            this.notify_views(function(view) {
                view.selected_updated();
            });

            return is_selected_;
        },
        hide_cell_result: function() {
            this.notify_views(function(view) {
              view.toggle_results(false);
            });
            return false;
        },
        show_cell_result: function() {
            this.notify_views(function(view) {
              view.toggle_results(true);
            });
            return true;
        },
        is_selected: function() {
            return is_selected_;
        },
        json: function() {
            return {
                content: content,
                language: this.language()
            };
        },
        change_object: function(obj) {
            obj = obj || {};
            if(obj.id && obj.filename)
                throw new Error("must specify only id or filename");
            if(!obj.filename) {
                var id = obj.id || this.id();
                if((id>0)!==true) // negative, NaN, null, undefined, etc etc.  note: this isn't <=
                    throw new Error("bad id for cell change object: " + id);
                obj.filename = Notebook.part_name(id, this.language());
            }
            if(obj.rename && _.isNumber(obj.rename))
                obj.rename = Notebook.part_name(obj.rename, this.language());
            return base_change_object.call(this, obj);
        }
    });
    return result;
};
