type Props = {
  name: string;
  type: string;
  label: string;
};

const CustomizedInput = (props: Props) => {
    return (
      <div className="flex flex-col mb-4">
        <label htmlFor={props.name} className="text-white mb-2">
          {props.label}
        </label>
        <input
          id={props.name}
          name={props.name}
          type={props.type}
          className="w-[400px] p-2 rounded-lg text-lg text-white bg-transparent border border-white placeholder-white focus:outline-none focus:border-cyan-400"
          placeholder={props.label}
        />
      </div>
    );
  };
  
  export default CustomizedInput;