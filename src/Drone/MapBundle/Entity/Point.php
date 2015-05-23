<?php

namespace Drone\MapBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\VirtualProperty;

/**
 * Point
 *
 * @ORM\Table()
 * @ORM\Entity
 *
 * @ExclusionPolicy("all")
 */
class Point
{
	/**
	 * @var integer
	 *
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @Expose
	 */
	private $id;

	/**
	 * @var float
	 *
	 * @ORM\Column(name="latitude", type="float")
	 */
	private $latitude;

	/**
	 * @var float
	 *
	 * @ORM\Column(name="longitude", type="float")
	 */
	private $longitude;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="action", type="string", length=20, nullable=true)
	 */
	private $action;

	/**
	 * @ORM\ManyToOne(targetEntity="Drone\UserBundle\Entity\User", inversedBy="points")
	 * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=true)
	 **/
	private $user;

	/**
	 * @ORM\ManyToOne(targetEntity="Drone\MapBundle\Entity\Field", inversedBy="points")
	 * @ORM\JoinColumn(name="field_id", referencedColumnName="id", nullable=true)
	 **/
	private $field;

	public function __construct(){
		$this->user  = null;
		$this->field = null;
	}

	/**
	 * Get id
	 *
	 * @return integer 
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * Set latitude
	 *
	 * @param float $latitude
	 * @return Drone
	 */
	public function setLatitude($latitude)
	{
		$this->latitude = $latitude;

		return $this;
	}

	/**
	 * Get latitude
	 *
	 * @return float 
	 */
	public function getLatitude()
	{
		return $this->latitude;
	}

	/**
	 * Set longitude
	 *
	 * @param float $longitude
	 * @return Drone
	 */
	public function setLongitude($longitude)
	{
		$this->longitude = $longitude;

		return $this;
	}

	/**
	 * Get longitude
	 *
	 * @return float 
	 */
	public function getLongitude()
	{
		return $this->longitude;
	}

	/**
	 * Set action
	 *
	 * @param string $action
	 * @return Point
	 */
	public function setAction($action)
	{
		$this->action = $action;

		return $this;
	}

	/**
	 * Get action
	 *
	 * @return string 
	 */
	public function getAction()
	{
		return $this->action;
	}

	/**
	 * Set user
	 *
	 * @param \Drone\UserBundle\Entity\User $user
	 * @return Drone
	 */
	public function setUser(\Drone\UserBundle\Entity\User $user = null)
	{
		$this->user = $user;
		
		return $this;
	}

	/**
	 * Get user
	 *
	 * @return \Drone\UserBundle\Entity\User 
	 */
	public function getUser()
	{
		return $this->user;
	}

	public function hasUser(){
		if(isset($this->user)){
			return true;
		}else{
			return false;
		}
	}

	/**
	 * Set field
	 *
	 * @param \Drone\MapBundle\Entity\Field $field
	 * @return Drone
	 */
	public function setField(\Drone\MapBundle\Entity\Field $field = null)
	{
		$this->field = $field;
		
		return $this;
	}

	/**
	 * Get field
	 *
	 * @return \Drone\MapBundle\Entity\Field 
	 */
	public function getField()
	{
		return $this->field;
	}

	public function hasField(){
		if(isset($this->field)){
			return true;
		}else{
			return false;
		}
	}

	/**
	 * Get the localisation
	 * 
	 * @return String
	 * @VirtualProperty 
	 */
	public function getLocation(){
		return array("lon" => $this->getLongitude(), "lat" => $this->getLatitude());
	}

}
