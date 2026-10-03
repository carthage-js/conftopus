export interface ArrayGetDescriptor {
  type: "array";
  index: number;
}

export interface ObjectGetDescriptor {
  type: "object";
  key: string;
}

export type GetDescriptor = ArrayGetDescriptor | ObjectGetDescriptor;

export type GetDescriptorPath = GetDescriptor[];
