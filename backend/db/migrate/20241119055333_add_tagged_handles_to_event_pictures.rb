class AddTaggedHandlesToEventPictures < ActiveRecord::Migration[7.1]
  def change
    add_column :event_pictures, :tagged_handles, :text
  end
end
