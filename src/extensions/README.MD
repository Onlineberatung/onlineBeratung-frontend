## Extensions Directory

For easier extending/overriding small components this directory reflects the structure of the src folder.

If you wan't to override a file from the src folder just create the same folder structure and add your custom file.

Example:

To override the Login.tsx file create a file in:

`/src/extensions/components/login/Login.tsx`

This will override the file in:

`/src/components/login/Login.tsx`

### Attention!

Please handle this feature with care.
If you override larger files you won't get any updates if the overwritten has been changed.

#### Best practice

If you want to override only a small part of a file it would be better to create a small component for it in the component you want to override and then override only this small part.
