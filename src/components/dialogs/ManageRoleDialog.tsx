import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Plus, X } from 'lucide-react';

interface ManageRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: string;
}

export const ManageRoleDialog: React.FC<ManageRoleDialogProps> = ({
  open,
  onOpenChange,
  role
}) => {
  const [permissions, setPermissions] = useState([
    { id: 1, name: 'View Schedules', granted: true },
    { id: 2, name: 'Submit Reports', granted: role !== 'Trainee' },
    { id: 3, name: 'Approve Shifts', granted: role === 'Senior Guard' },
    { id: 4, name: 'Manage Guards', granted: role === 'Senior Guard' },
    { id: 5, name: 'Access Analytics', granted: role === 'Senior Guard' }
  ]);

  const [newPermission, setNewPermission] = useState('');

  const handlePermissionToggle = (id: number) => {
    setPermissions(permissions.map(p =>
      p.id === id ? { ...p, granted: !p.granted } : p
    ));
  };

  const handleAddPermission = () => {
    if (newPermission.trim()) {
      setPermissions([
        ...permissions,
        {
          id: permissions.length + 1,
          name: newPermission.trim(),
          granted: false
        }
      ]);
      setNewPermission('');
    }
  };

  const handleSave = () => {
    // TODO: Implement actual permission update
    console.log('Updating permissions for', role, permissions);
    alert('Role permissions updated successfully!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Manage {role} Permissions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Current Permissions */}
          <div className="space-y-2">
            <h3 className="font-medium">Current Permissions</h3>
            <div className="space-y-2">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span>{permission.name}</span>
                  <Button
                    variant={permission.granted ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePermissionToggle(permission.id)}
                  >
                    {permission.granted ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Permission */}
          <div className="space-y-2">
            <h3 className="font-medium">Add New Permission</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter permission name"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
              />
              <Button onClick={handleAddPermission}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Shield className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};