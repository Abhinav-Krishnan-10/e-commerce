"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { Edit, Trash2, MapPin, Plus, Loader2, Check } from "lucide-react";

type AddressForm = {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  type: "shipping" | "billing";
  isDefault: boolean;
};

interface Address {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
}

function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<string | null>(null);

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: "shipping",
      isDefault: false,
      country: "US",
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFormSubmit(data: AddressForm) {
    const isEditing = !!editingAddress;
    const url = isEditing ? `/api/addresses/${editingAddress.id}` : "/api/addresses";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save address");
      }

      toast.success(isEditing ? "Address updated" : "Address added");
      fetchAddresses();
      reset();
      setEditingAddress(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  function handleEdit(address: Address) {
    setEditingAddress(address);
    reset({
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || "",
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || "",
      type: address.type as "shipping" | "billing",
      isDefault: address.isDefault,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setDeletingAddress(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to delete address");
    } finally {
      setDeletingAddress(null);
    }
  }

  function handleNewAddress() {
    setEditingAddress(null);
    reset({
      type: "shipping",
      isDefault: false,
      country: "US",
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Addresses</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your shipping and billing addresses</p>
        </div>
        <Button onClick={handleNewAddress}>
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h2 className="text-xl font-semibold">No addresses yet</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Add an address to speed up checkout.</p>
          <Button onClick={handleNewAddress} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="border rounded-lg p-6 relative">
              {address.isDefault && (
                <span className="absolute -top-2 -right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  <Check className="mr-1 h-3 w-3" />
                  Default
                </span>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium capitalize">{address.type}</span>
                    {address.isDefault && <MapPin className="h-4 w-4 text-primary" />}
                  </div>
                  <address className="not-italic text-gray-600 dark:text-gray-400">
                    {address.firstName} {address.lastName}
                    {address.company && <> <br />{address.company} </>}
                    <br />{address.address1}
                    {address.address2 && <> <br />{address.address2} </>}
                    <br />{address.city}, {address.state} {address.postalCode}
                    <br />{address.country}
                    {address.phone && <> <br />{address.phone} </>}
                  </address>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(address)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingAddress === address.id}
                  >
                    {deletingAddress === address.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editingAddress} onOpenChange={(open) => !open && setEditingAddress(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "New Address"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...form.register("firstName")} aria-invalid={!!errors.firstName} />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...form.register("lastName")} aria-invalid={!!errors.lastName} />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company (optional)</Label>
              <Input id="company" {...form.register("company")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address1">Address</Label>
              <Input id="address1" {...form.register("address1")} aria-invalid={!!errors.address1} />
              {errors.address1 && <p className="text-sm text-red-500">{errors.address1.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
              <Input id="address2" {...form.register("address2")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("city")} aria-invalid={!!errors.city} />
                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...form.register("state")} aria-invalid={!!errors.state} />
                {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">ZIP Code</Label>
                <Input id="postalCode" {...form.register("postalCode")} aria-invalid={!!errors.postalCode} />
                {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                {...form.register("country")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" type="tel" {...form.register("phone")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  {...form.register("type")}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="shipping">Shipping</option>
                  <option value="billing">Billing</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...form.register("isDefault")} className="rounded border-gray-300" />
                  <span className="text-sm">Set as default</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingAddress ? "Save Changes" : "Add Address"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingAddress(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddressesPage;