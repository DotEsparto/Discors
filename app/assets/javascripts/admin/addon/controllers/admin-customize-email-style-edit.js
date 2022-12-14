import Controller from "@ember/controller";
import I18n from "I18n";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";

export default Controller.extend({
  dialog: service(),

  @discourseComputed("model.isSaving")
  saveButtonText(isSaving) {
    return isSaving ? I18n.t("saving") : I18n.t("admin.customize.save");
  },

  @discourseComputed("model.changed", "model.isSaving")
  saveDisabled(changed, isSaving) {
    return !changed || isSaving;
  },

  actions: {
    save() {
      if (!this.model.saving) {
        this.set("saving", true);
        this.model
          .update(this.model.getProperties("html", "css"))
          .catch((e) => {
            const msg =
              e.jqXHR.responseJSON && e.jqXHR.responseJSON.errors
                ? I18n.t("admin.customize.email_style.save_error_with_reason", {
                    error: e.jqXHR.responseJSON.errors.join(". "),
                  })
                : I18n.t("generic_error");
            this.dialog.alert(msg);
          })
          .finally(() => this.set("model.changed", false));
      }
    },
  },
});
